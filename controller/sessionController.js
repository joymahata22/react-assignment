const Session = require('../models/Session');

exports.getPublicSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ status: 'published' })
      .populate('user_id', 'username')
      .sort('-created_at');
    
    res.json({
      status: 'success',
      data: sessions
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getUserSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user_id: req.user._id })
      .sort('-updated_at');
    
    res.json({
      status: 'success',
      data: sessions
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getSingleSession = async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      user_id: req.user._id
    });

    if (!session) {
      return res.status(404).json({
        status: 'error',
        message: 'Session not found'
      });
    }

    res.json({
      status: 'success',
      data: session
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.saveDraft = async (req, res) => {
  try {
    const { title, tags, json_file_url } = req.body;
    const sessionData = {
      user_id: req.user._id,
      title,
      tags,
      json_file_url,
      status: 'draft'
    };

    // Update if _id exists, create new if not
    let session;
    if (req.body._id) {
      session = await Session.findOneAndUpdate(
        { _id: req.body._id, user_id: req.user._id },
        sessionData,
        { new: true, runValidators: true }
      );
    } else {
      session = await Session.create(sessionData);
    }

    res.json({
      status: 'success',
      data: session
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.publishSession = async (req, res) => {
  try {
    const { _id } = req.body;
    
    const session = await Session.findOneAndUpdate(
      { _id, user_id: req.user._id },
      { status: 'published' },
      { new: true, runValidators: true }
    );

    if (!session) {
      return res.status(404).json({
        status: 'error',
        message: 'Session not found'
      });
    }

    res.json({
      status: 'success',
      data: session
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user._id
    });

    if (!session) {
      return res.status(404).json({
        status: 'error',
        message: 'Session not found or you do not have permission to delete it'
      });
    }

    res.json({
      status: 'success',
      message: 'Session deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
