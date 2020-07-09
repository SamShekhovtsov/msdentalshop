module OmniauthHelper
  def user_signed_in?
    session[:user_id].present?
  end

  def authenticate_user!
    #if user_signed_in?
    #  @current_user = session['userinfo']
    #else
    #  redirect_to root_path
    #end
  end

  def current_user
    @current_user ||= User.find_by(id: session[:user_id])
  end

  def reset_session
    session[:user_id] = nil if session[:user_id].present?
  end
end