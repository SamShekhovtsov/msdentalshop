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

  root 'welcome#index'
end
