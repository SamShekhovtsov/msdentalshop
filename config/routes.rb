Rails.application.routes.draw do
  get 'welcome/index'
  get 'patient/index'
  get 'appointment/index'
  
  root 'welcome#index'
end
