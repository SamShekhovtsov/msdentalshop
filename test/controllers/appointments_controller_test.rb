require 'test_helper'

class AppointmentsControllerTest < ActionDispatch::IntegrationTest  
  
  # called before every single test
  setup do
    @appointment = appointments(:aapointment1)
    @testNewAppointment = appointments(:newAppointment)
  end

  # called after every single test
  teardown do
    # when controller is using cache it may be a good idea to reset it afterwards
    Rails.cache.clear
  end
  
  test "should load appointments list page" do
    get appointments_path

    assert_response :success
    assert_equal "index", @controller.action_name
  end

  test "should get schedule new appointment page" do
    get new_appointment_path
    assert_response :success
  end
end
