require 'test_helper'

class DoctorsControllerTest < ActionDispatch::IntegrationTest
  test "should load doctors list page" do
    get doctors_path

    assert_response :success
    assert_equal "index", @controller.action_name
  end

  test "should new doctor page" do
    get new_doctor_path
    assert_response :success
  end
end
