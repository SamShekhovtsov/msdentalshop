require 'test_helper'

class PatientsControllerTest < ActionDispatch::IntegrationTest
  test "should load patients list page" do
    get patients_path

    assert_response :success
    assert_equal "index", @controller.action_name
  end

  test "should load new patient page" do
    get new_patient_path
    assert_response :success
  end
end
