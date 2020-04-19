Rails.application.routes.draw do
  #get 'doctors/index'
  #get 'doctor/index'
  get 'welcome/index'
  #get 'patient/index'
  #get 'appointment/index'
  
  resources :doctors do
    resources :appointments
  end

  resources :patients do
    resources :appointments
  end
  
  resources :appointments

  root 'welcome#index'
end
