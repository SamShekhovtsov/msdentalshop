Rails.application.routes.draw do
  #get 'doctor/index'
  get 'welcome/index'
  #get 'patient/index'
  #get 'appointment/index'
  
  resources :doctor
  resources :appointments

  root 'welcome#index'
end
