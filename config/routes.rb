Rails.application.routes.draw do
  #root to: redirect('/about.html')
  post 'contact', to: 'contacts#process_form'
  root to: 'visitors#new'
end
