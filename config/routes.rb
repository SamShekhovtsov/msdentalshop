Rails.application.routes.draw do
  #get 'patients/index'
  #get 'doctors/index'
  get 'welcome/index'
  #get 'patient/index'
  #get 'appointment/index'
  
  resources :doctors 
  #do
  #  resources :appointments
  #end

  resources :patients
  # do
  #  resources :appointments
  #end

  resources :appointments

  #devise_for :users, controllers: {omniauth_callbacks: "users/omniauth_callbacks"}
  #devise_for :users, controllers: {omniauth_callbacks: "users/omniauth_callbacks"}

  #devise_scope :user do
    #root 'sessions#new'
    #get 'sign_in', :to => 'devise/sessions#new', :as => :new_user_session
    #get 'sign_out', :to => 'devise/sessions#destroy', :as => :destroy_user_session
    #get 'logout', to: 'devise/sessions#destroy', as: :logout
    #get '/users/sign_in', to: 'sessions#new', as: :new_user_session
    #post '/users/sign_in', to: 'devise/sessions#create', as: :user_session
    #get '/users/sign_out', to: 'devise/sessions#destroy', as: :destroy_user_session
  #end

  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations',
    omniauth_callbacks: 'omniauth_callbacks'
  }
  devise_scope :user do
    get 'sign_in', to: 'users/sessions#new'
    get 'sign_up', to: 'users/registrations#new'
    get 'forgot_password', to: 'users/passwords#new'
    get 'reset_password', to: 'users/passwords#edit'
  end

  root to: 'welcome#index'
end
