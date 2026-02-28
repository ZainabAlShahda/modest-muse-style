const { chat } = require('../services/aiAgent.service');
const { sendResponse } = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

/**
 * POST /api/v1/chat
 * Body: { messages: [{role: "user"|"assistant", content: string}] }
 */
exports.chatWithAgent = async (req, res, next) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return next(new ApiError('messages array is required', 400));
    }

    // Sanitize: only allow valid roles and string content; cap history at 20 turns
    const valid = messages
      .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
      .map((m) => ({ role: m.role, content: m.content.trim().slice(0, 2000) }))
      .slice(-20);

    if (!valid.length) {
      return next(new ApiError('No valid messages provided', 400));
    }

    // Ensure conversation starts with a user message (Anthropic requirement)
    if (valid[0].role !== 'user') {
      return next(new ApiError('Conversation must start with a user message', 400));
    }

    const reply = await chat(valid);
    sendResponse(res, { data: { reply } });
  } catch (err) {
    next(err);
  }
};
