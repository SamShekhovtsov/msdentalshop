Rails.application.routes.draw do
  #get 'patients/index'
  #get 'doctors/index'
  get 'welcome/index'
  #get 'patient/index'
  #get 'appointment/index'

  get 'auth/auth0', as: 'authentication'        # Triggers authentication process
  get 'auth/auth0/callback' => 'auth0#callback' # Authentication successful
  get 'auth/failure' => 'auth0#failure'         # Authentication fail
  
  resources :doctors 
  #do
  #  resources :appointments
  #end

  resources :patients
  # do
  #  resources :appointments
  #end

  resources :appointments

  root 'welcome#index'
end
