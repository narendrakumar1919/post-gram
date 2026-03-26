const models = require("../database/models");
const helpers = require("../utils/helpers");
const { messages } = require("../config/messages");
const PostServices = require("../services/post.services");

/**
 * Get all posts
 * @param {Request} request
 * @param {Response} reply
 */
exports.getAllPosts = (request, reply) => {
  models.post
    .find()
    .select("-id -__v")
    .then((posts) => {
      return helpers.sendSuccessResponse(
        messages.common_reply_messages.success,
        posts,
        reply
      );
    })
    .catch((error) => {
      return helpers.sendErrorResponse(
        error.message || messages.common_reply_messages.error_unknown,
        reply
      );
    });
};

/**
 * Get a post by id
 * @param {Request} request
 * @param {Response} reply
 */
exports.getPostById = (request, reply) => {
  models.post
    .findById(request.params.post_id)
    .select("-id -__v")
    .then((post) => {
      return helpers.sendSuccessResponse(
        messages.common_reply_messages.success,
        post,
        reply
      );
    })
    .catch((error) => {
      return helpers.sendErrorResponse(
        error.message && error.message.includes("Cast to ObjectId failed")
          ? "Incorrect post id."
          : messages.common_reply_messages.error_unknown,
        reply,
        error.message && error.message.includes("Cast to ObjectId failed")
          ? 404
          : undefined
      );
    });
};

/**
 * Add a post
 * @param {Request} request
 * @param {Response} reply
 */
exports.addPost = (request, reply) => {
  models.post
    .create(request.body)
    .then((success) => {
      return helpers.sendSuccessResponse(
        messages.common_reply_messages.success_post_added,
        {},
        reply,
        1
      );
    })
    .catch((error) => {
      return helpers.sendErrorResponse(
        error.message || messages.common_reply_messages.error_unknown,
        reply
      );
    });
};

/**
 * Edit a post
 * @param {Request} request
 * @param {Response} reply
 */
exports.editPostById = (request, reply) => {
  models.post
    .updateOne({ _id: request.params.post_id }, request.body)
    .then((success) => {
      if (success.matchedCount) {
        return helpers.sendSuccessResponse(
          messages.common_reply_messages.success_post_updated,
          {},
          reply
        );
      } else {
        return helpers.sendErrorResponse(
          messages.common_reply_messages.success_post_not_exist,
          reply
        );
      }
    })
    .catch((error) => {
      return helpers.sendErrorResponse(
        error.message || messages.common_reply_messages.error_unknown,
        reply
      );
    });
};

/**
 * Delete a post
 * @param {Request} request
 * @param {Response} reply
 */
exports.deletePostById = (request, reply) => {
  models.post
    .deleteOne({ _id: request.params.post_id })
    .then((success) => {
      if (success.deletedCount) {
        return helpers.sendSuccessResponse(
          messages.common_reply_messages.success_post_deleted,
          {},
          reply
        );
      } else {
        return helpers.sendErrorResponse(
          messages.common_reply_messages.success_post_not_exist,
          reply
        );
      }
    })
    .catch((error) => {
      return helpers.sendErrorResponse(
        error.message || messages.common_reply_messages.error_unknown,
        reply
      );
    });
};

/**
 * Rate a post
 * @param {Request} request
 * @param {Response} reply
 */
exports.ratePostById = (request, reply) => {
  models.post
    .findOne({ _id: request.params.post_id })
    .select("_id")
    .then((post) => {
      if (post && post._id) {
        models.postRating
          .create({
            post_id: request.params.post_id,
            ...request.body,
          })
          .then(() => {
            PostServices.updatePostAverageRatingByPostId(post._id);
            return helpers.sendSuccessResponse(
              messages.common_reply_messages.success_post_rating_added,
              {},
              reply,
              1
            );
          });
      } else {
        return helpers.sendErrorResponse(
          messages.common_reply_messages.success_post_not_exist,
          reply
        );
      }
    })
    .catch((error) => {
      return helpers.sendErrorResponse(
        error.message && error.message.includes("Cast to ObjectId failed")
          ? "Incorrect post id."
          : messages.common_reply_messages.error_unknown,
        reply,
        error.message && error.message.includes("Cast to ObjectId failed")
          ? 404
          : undefined
      );
    });
};
