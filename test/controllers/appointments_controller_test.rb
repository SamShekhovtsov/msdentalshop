require 'test_helper'

class AppointmentsControllerTest < ActionDispatch::IntegrationTest  
  
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

  test "should load appointments list page" do
    get appointments_path

    assert_response :success
    assert_equal "index", @controller.action_name
  end

  test "should get schedule new appointment page" do
    get new_appointment_path
    assert_response :success
  end

  test "should show appointment" do
    get appointment_url(@appointment)
    assert_response :success
  end

  test "should load new appointment page" do
    get new_appointment_path
    assert_response :success
  end

  test "should NOT create appointment" do
    get new_appointment_path
    assert_response :success

    post appointments_url, params: { appointment: { date: nil } }
  
    assert_response :success
    assert_equal 'Error while trying to schedule new appointment.', flash[:error]
  end

  test "should schedule appointment" do
    get new_appointment_path
    assert_response :success

    assert_difference('Appointment.count') do
      post appointments_url, params: { appointment: @testNewAppointment.attributes }
    end
  
    assert_response :redirect
    assert_redirected_to appointment_path(Appointment.last)
    assert_equal 'Appointment was scheduled successfully.', flash[:notice]
    follow_redirect!
    assert_response :success    
  end

  test "should destroy appointment" do
    assert_difference('Appointment.count', -1) do
      delete appointment_url(@appointment)
    end
 
    assert_redirected_to appointments_path
  end
end
