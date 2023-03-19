/**
  * @api {post} /api/register register user
  * @apiName register new user
  * @apiGroup Auth
  *
  * @apiBody {String} name user's name
  * @apiBody {String} email user's email
  * @apiBody {String} wnumber user's mobile no
  * @apiBody {String} password user's password
  *
  * @apiSuccess {Boolean} status status of api response
  * @apiSuccess {String} msg  respective message for users.
  * @apiSuccess {Array} data  details of respective api
  * 
  * @apiError {Boolean} status status of api response
  * @apiError {String} msg  respective message for users.
  * @apiError {Array} error  details of respective api
  */


/**
  * @api {post} /api/resend resend OTP
  * @apiName resend OTP
  * @apiGroup Auth
  *
  * @apiBody {String} wnumber user's mobile no
  *
  * @apiSuccess {Boolean} status status of api response
  * @apiSuccess {String} msg  respective message for users.
  * @apiSuccess {Array} data  details of respective api
  * 
  * @apiError {Boolean} status status of api response
  * @apiError {String} msg  respective message for users.
  * @apiError {Array} error  details of respective api
  */

/**
  * @api {post} /api/login user login 
  * @apiName login user 
  * @apiGroup Auth
  *
  * @apiBody {String} wnumber user's mobile no
  * @apiBody {String} password user's password
  *
  * @apiSuccess {Boolean} status status of api response
  * @apiSuccess {String} msg  respective message for users.
  * @apiSuccess {Array} data  details of respective api
  * 
  * @apiError {Boolean} status status of api response
  * @apiError {String} msg  respective message for users.
  * @apiError {Array} error  details of respective api
  */

/**
  * @api {post} /api/verify verify OTP
  * @apiName verify OTP
  * @apiGroup Auth
  *
  * @apiBody {String} wnumber user's mobile no
  * @apiBody {String} otp OTP(one time password)
  *
  * @apiSuccess {Boolean} status status of api response
  * @apiSuccess {String} msg  respective message for users.
  * @apiSuccess {Array} data  details of respective api
  * 
  * @apiError {Boolean} status status of api response
  * @apiError {String} msg  respective message for users.
  * @apiError {Array} error  details of respective api
  */

/**
  * @api {post} /api/verify verify OTP
  * @apiName verify OTP
  * @apiGroup Auth
  *
  * @apiBody {String} wnumber user's mobile no
  * @apiBody {String} otp OTP(one time password)
  *
  * @apiSuccess {Boolean} status status of api response
  * @apiSuccess {String} msg  respective message for users.
  * @apiSuccess {Array} data  details of respective api
  * 
  * @apiError {Boolean} status status of api response
  * @apiError {String} msg  respective message for users.
  * @apiError {Array} error  details of respective api
  */

/**
  * @api {post} /api/verifyMOtp send OTP for forget password
  * @apiName Forget password  send otp
  * @apiGroup Auth
  *
  * @apiBody {String} wnumber user's mobile no
  *
  * @apiSuccess {Boolean} status status of api response
  * @apiSuccess {String} msg  respective message for users.
  * @apiSuccess {Array} data  details of respective api
  * 
  * @apiError {Boolean} status status of api response
  * @apiError {String} msg  respective message for users.
  * @apiError {Array} error  details of respective api
  */

/**
  * @api {put} /api/verifyMOtp verify OTP and change password
  * @apiName verify otp and change password
  * @apiGroup Auth
  *
  * @apiBody {String} wnumber user's mobile no
  * @apiBody {String} reOtp OTP
  * @apiBody {String} repassword New password
  *
  * @apiSuccess {Boolean} status status of api response
  * @apiSuccess {String} msg  respective message for users.
  * @apiSuccess {Array} data  details of respective api
  * 
  * @apiError {Boolean} status status of api response
  * @apiError {String} msg  respective message for users.
  * @apiError {Array} error  details of respective api
  */

/**
  * @api {get} /api/user get users details
  * @apiName get users details
  * @apiGroup Auth
  *
  *
  * @apiSuccess {Boolean} status status of api response
  * @apiSuccess {String} msg  respective message for users.
  * @apiSuccess {Array} data  details of respective api
  * 
  * @apiError {Boolean} status status of api response
  * @apiError {String} msg  respective message for users.
  * @apiError {Array} error  details of respective api
  */