class User < ActiveRecord::Base
  devise :rememberable, :omniauthable, omniauth_providers: [:google_oauth2]
  attr_accessor :email

  def self.find_for_google_oauth2(access_token, signed_in_resource=nil)
    data = access_token.info
    user = User.where(:email => data["email"]).first
    unless user
      user = User.create(email: data["email"] )
    end
    user
  end
end
