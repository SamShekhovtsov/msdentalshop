require 'test_helper'

class AppointmentFlowTest < ActionDispatch::IntegrationTest
  
  # called before every single test
  setup do
    @appointment = appointments(:appointment1)
    @testNewAppointment = appointments(:newAppointment)
  end

  # called after every single test
  teardown do
    # when controller is using cache it may be a good idea to reset it afterwards
    Rails.cache.clear
  end

  test "can schedule an appointment" do
    get new_appointment_path
    assert_response :success
   
    post appointments_url, params: { appointment: @testNewAppointment.attributes }
    
    assert_response :redirect
    follow_redirect!
    assert_response :success
    assert_select "p", "Appointment date:\n  " << @testNewAppointment.date.to_s
  end
end
