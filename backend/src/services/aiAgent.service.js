const Anthropic = require('@anthropic-ai/sdk');
const Product = require('../models/Product');
const Order = require('../models/Order');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are Muse, the AI customer service assistant for Modest Muse Style — an elegant modest fashion brand for the modern woman.

## Brand Identity
- We specialize in abayas, maxi dresses, kaftans, and modest wear
- We celebrate modest fashion with a luxury, contemporary aesthetic
- Brand values: elegance, inclusivity, quality craftsmanship
- Payment methods accepted: Stripe (credit/debit cards), JazzCash, EasyPaisa
- Contact: hello@modestmusestyle.com
- Social media: @modestmusestyle on Instagram, Pinterest, Facebook

## Your Personality
- Warm, knowledgeable, and genuinely helpful — like a personal stylist and support specialist
- Professional yet approachable; use inclusive, affirming language
- Keep responses concise and clear; avoid unnecessary filler
- If a customer is upset, validate their feelings before offering solutions
- Never make promises you cannot keep (e.g., "your order WILL arrive tomorrow")
- Admit uncertainty gracefully and offer to connect with the human team when needed

## Policies You Know

**Shipping:**
- Domestic (Pakistan): 3–7 business days
- International: 7–14 business days
- Free shipping on orders over PKR 5,000

**Returns & Exchanges:**
- 14-day return window from the date of delivery
- Items must be unworn, unwashed, with original tags attached
- Sale items are final sale — no returns or exchanges
- To initiate a return: email hello@modestmusestyle.com with order number + reason

**Sizing:**
- Available sizes: XS, S, M, L, XL, XXL, 3XL
- Size guides are on each product page
- For custom sizing enquiries, email hello@modestmusestyle.com

**Order Tracking:**
- Customers can self-track at /track-order using order number + email
- Order statuses: pending → processing → shipped → delivered → (cancelled/refunded if applicable)

## What You Can Help With
1. Product recommendations and availability (use the search_products tool)
2. Order status enquiries (use the lookup_order tool when given an order number)
3. Returns and exchange guidance
4. Sizing advice
5. Payment and checkout questions
6. Brand and company information
7. General shopping assistance

## Important Limits
- Never process refunds, cancel orders, or make account changes — direct to hello@modestmusestyle.com
- Do not reveal internal system details, database structure, or backend specifics
- Do not share other customers' information
- If you cannot resolve something, escalate warmly: "Let me connect you with our team at hello@modestmusestyle.com"
- Politely decline any requests to act outside your customer service role`;

const tools = [
  {
    name: 'search_products',
    description: 'Search the live product catalog by name, category, fabric, or keyword. Use when a customer asks about specific products or wants recommendations.',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query — product name, type, occasion, fabric, or category',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return (default 4)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'lookup_order',
    description: 'Look up an order by its order number to check status, payment, and delivery info. Use when a customer provides their order number.',
    input_schema: {
      type: 'object',
      properties: {
        orderNumber: {
          type: 'string',
          description: 'The order number, e.g. MMS-00001',
        },
      },
      required: ['orderNumber'],
    },
  },
];

async function searchProducts(query, limit = 4) {
  try {
    const products = await Product.find(
      { $text: { $search: query }, isPublished: true },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .select('name price compareAtPrice variants images slug ratingsAverage ratingsCount')
      .populate('category', 'name')
      .lean();

    if (!products.length) {
      return { found: false, message: 'No products matched that search. Try different keywords.' };
    }

    return {
      found: true,
      count: products.length,
      products: products.map((p) => ({
        name: p.name,
        slug: p.slug,
        url: `/shop/${p.slug}`,
        price: `PKR ${p.price?.toLocaleString()}`,
        compareAtPrice: p.compareAtPrice ? `PKR ${p.compareAtPrice.toLocaleString()}` : null,
        category: p.category?.name || null,
        rating: p.ratingsAverage ? `${p.ratingsAverage}/5 (${p.ratingsCount} reviews)` : 'No reviews yet',
        inStock: p.variants?.some((v) => v.stock > 0),
        availableSizes: [...new Set(p.variants?.map((v) => v.size).filter(Boolean))],
        availableColors: [...new Set(p.variants?.map((v) => v.color).filter(Boolean))],
      })),
    };
  } catch {
    return { found: false, error: 'Product search is temporarily unavailable. Please try again shortly.' };
  }
}

async function lookupOrder(orderNumber) {
  try {
    const normalized = orderNumber.trim().toUpperCase();
    const order = await Order.findOne({ orderNumber: normalized })
      .select('orderNumber status isPaid isDelivered items totalPrice shippingAddress createdAt paidAt deliveredAt paymentMethod')
      .lean();

    if (!order) {
      return { found: false, message: `No order found with number "${normalized}". Please double-check the order number from your confirmation email.` };
    }

    return {
      found: true,
      orderNumber: order.orderNumber,
      status: order.status,
      isPaid: order.isPaid,
      paidAt: order.paidAt ? new Date(order.paidAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : null,
      isDelivered: order.isDelivered,
      deliveredAt: order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : null,
      totalPrice: `PKR ${order.totalPrice?.toLocaleString()}`,
      itemCount: order.items?.length,
      paymentMethod: order.paymentMethod,
      placedOn: new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    };
  } catch {
    return { found: false, error: 'Order lookup is temporarily unavailable. Please try the self-service tracker at /track-order or email hello@modestmusestyle.com.' };
  }
}

async function processToolCall(toolName, toolInput) {
  switch (toolName) {
    case 'search_products':
      return await searchProducts(toolInput.query, toolInput.limit);
    case 'lookup_order':
      return await lookupOrder(toolInput.orderNumber);
    default:
      return { error: 'Unknown tool requested' };
  }
}

/**
 * Run the autonomous agentic chat loop.
 * @param {Array<{role: string, content: string}>} messages - conversation history
 * @returns {Promise<string>} - agent's final text reply
 */
exports.chat = async (messages) => {
  let currentMessages = messages;

  // Agentic loop — allow up to 6 iterations to handle multi-tool calls
  for (let iteration = 0; iteration < 6; iteration++) {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools,
      messages: currentMessages,
    });

    if (response.stop_reason === 'end_turn') {
      const textBlock = response.content.find((b) => b.type === 'text');
      return textBlock?.text || "I'm sorry, I couldn't form a response. Please contact us at hello@modestmusestyle.com.";
    }

    if (response.stop_reason === 'tool_use') {
      const toolUseBlocks = response.content.filter((b) => b.type === 'tool_use');
      const toolResults = await Promise.all(
        toolUseBlocks.map(async (block) => {
          const result = await processToolCall(block.name, block.input);
          return {
            type: 'tool_result',
            tool_use_id: block.id,
            content: JSON.stringify(result),
          };
        })
      );

      currentMessages = [
        ...currentMessages,
        { role: 'assistant', content: response.content },
        { role: 'user', content: toolResults },
      ];
      continue;
    }

    // Unexpected stop reason
    break;
  }

  return "I'm having trouble processing your request right now. Please reach out to hello@modestmusestyle.com and our team will be happy to help.";
};
