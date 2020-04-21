require 'test_helper'

class PatientsControllerTest < ActionDispatch::IntegrationTest

  # called before every single test
  setup do
    @patient = patients(:patient1)
    @testNewPatient = patients(:newPatient)
  end

  # called after every single test
  teardown do
    # when controller is using cache it may be a good idea to reset it afterwards
    Rails.cache.clear
  end

  test "should show patient" do
    get patient_url(@patient)
    assert_response :success
  end

  test "should load patients list page" do
    get patients_path

    assert_response :success
    assert_equal "index", @controller.action_name
  end

  test "should load new patient page" do
    get new_patient_path
    assert_response :success
  end

  test "should create patient" do
    get new_patient_path
    assert_response :success

    assert_difference('Patient.count') do
      post patients_url, params: { patient: @testNewPatient.attributes }
    end
  
    assert_response :redirect
    assert_redirected_to patient_path(Patient.last)
    assert_equal 'Patient profile was successfully created.', flash[:notice]
    follow_redirect!
    assert_response :success
    assert_select "p", "Patient name:\n  Some new patient with nice name"
  end

  test "should destroy patient" do
    assert_difference('Patient.count', -1) do
      delete patient_url(@patient)
    end
 
    assert_redirected_to patients_path
  end
 
  test "should update patient" do
    @patientToUpdate = patients(:patientUpdate)
    patch patient_url(@patient), params: { patient: @patientToUpdate.attributes }
 
    assert_redirected_to patient_path(@patient)
    # Reload association to fetch updated data and assert that title is updated.
    @patient.reload
    assert_equal @patientToUpdate.name, @patient.name
  end
end
