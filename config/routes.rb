Rails.application.routes.draw do
  #root to: redirect('/about.html')
  root to: 'visitors#new'
end
