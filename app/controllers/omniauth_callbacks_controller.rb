class OmniauthCallbacksController < Devise::OmniauthCallbacksController
  # replace with your authenticate method
  #include OmniauthHelper
  #skip_before_action :authenticate_user!

  def google_oauth2
    auth = request.env["omniauth.auth"]
    # Rails.logger.debug auth
    # Rails.logger.debug auth["provider"]
    # Rails.logger.debug auth["uid"]
    # Rails.logger.debug auth["info"]["email"]
    # Rails.logger.debug auth["info"]["name"]
    user = User.where(provider: auth["provider"], uid: auth["uid"])
            .first_or_initialize(email: auth["info"]["email"])
    user.name ||= auth["info"]["name"]
    user.save!
    #Rails.logger.debug user
    user.remember_me = true
    sign_in(:user, user)

    redirect_to after_sign_in_path_for(user)
  end
end