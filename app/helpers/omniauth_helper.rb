module OmniauthHelper
  def user_signed_in?
    #session['userinfo'].present?
  end

  def authenticate_user!
    Rails.logger.debug 'session info below: '
    Rails.logger.debug session
    Rails.logger.debug session['userinfo']
    #if user_signed_in?
    #  @current_user = session['userinfo']
    #else
    #  redirect_to root_path
    #end
  end

  def current_user
    #@current_user
  end

  def reset_session
    #session['userinfo'] = nil if session['userinfo'].present?
  end
end