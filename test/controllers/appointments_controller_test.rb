require 'test_helper'

class AppointmentsControllerTest < ActionDispatch::IntegrationTest
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
