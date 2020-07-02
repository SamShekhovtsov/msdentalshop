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

  devise_for :users, controllers: {omniauth_callbacks: "omniauth_callbacks"}
  #devise_for :users, controllers: {omniauth_callbacks: "users/omniauth_callbacks"}
  devise_scope :user do
    get 'sign_in', :to => 'devise/sessions#new', :as => :new_user_session
    get 'sign_out', :to => 'devise/sessions#destroy', :as => :destroy_user_session
  end

  root 'welcome#index'
end
