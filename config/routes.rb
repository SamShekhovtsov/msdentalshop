Rails.application.routes.draw do
  #root to: redirect('/about.html')
  #post 'contact', to: 'contacts#process_form'
  resources :contacts, only: [:new, :create]
  resources :visitors, only: [:new, :create]
  root to: 'visitors#new'
end
