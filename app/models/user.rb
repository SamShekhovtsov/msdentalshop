class User < ActiveRecord::Base
  devise :rememberable, :omniauthable, omniauth_providers: [:google_oauth2]
  attr_accessor :name, :email

  def self.find_for_google_oauth2(access_token, signed_in_resource=nil)
    data = access_token.info
    user = User.where(:email => data["email"]).first
    unless user
      user = User.create(email: data["email"] )
    end
    user
  end

  def self.from_omniauth(auth_hash)
    user = find_or_create_by(uid: auth_hash['uid'], provider: auth_hash['provider'], email: auth_hash['info']['email'])
    Rails.logger.debug 'loading user'
    Rails.logger.debug auth_hash['info']['email']
    user.name = auth_hash['info']['name']
    #user.location = auth_hash['info']['location']
    #user.image_url = auth_hash['info']['image']
    #user.url = auth_hash['info']['urls']['Twitter']
    user.save!
    user
  end
end
