require 'test_helper'

class DoctorsControllerTest < ActionDispatch::IntegrationTest

  # called before every single test
  setup do
    @doctor = doctors(:doctor1)
    @testNewDoctor = doctors(:newDoctor)
  end

  # called after every single test
  teardown do
    # when controller is using cache it may be a good idea to reset it afterwards
    Rails.cache.clear
  end

  test "should show doctor" do
    get doctor_url(@doctor)
    assert_response :success
  end

  test "should load doctors list page" do
    get doctors_path

    assert_response :success
    assert_equal "index", @controller.action_name
  end

  test "should load new doctor page" do
    get new_doctor_path
    assert_response :success
  end

  test "should NOT create doctor without required paramteres" do
    get new_doctor_path
    assert_response :success

    post doctors_url, params: { doctor: { name: nil } }
  
    assert_response :success
    assert_equal 'Error while trying to create doctor profile.', flash[:error]
    assert_template "new"
  end

  test "should create doctor with valid parameters" do
    get new_doctor_path
    assert_response :success

    assert_difference('Doctor.count') do
      post doctors_url, params: { doctor: @testNewDoctor.attributes }
    end
  
    assert_response :redirect
    assert_redirected_to doctor_path(Doctor.last)
    assert_equal 'Doctor profile was successfully created.', flash[:notice]
    follow_redirect!
    assert_response :success
    assert_select "p", "Doctor name:\n  Doctor name should create"
  end

  test "should destroy doctor" do
    assert_difference('Doctor.count', -1) do
      delete doctor_url(@doctor)
    end
 
    assert_redirected_to doctors_path
  end
 
  test "should update doctor with correct patamteres" do
    @doctorToUpdate = doctors(:doctorUpdate)
    patch doctor_url(@doctor), params: { doctor: @doctorToUpdate.attributes }
 
    assert_redirected_to doctor_path(@doctor)
    # Reload association to fetch updated data and assert that title is updated.
    @doctor.reload
    assert_equal @doctorToUpdate.name, @doctor.name
    assert_equal @doctorToUpdate.level, @doctor.level
    assert_equal @doctorToUpdate.profilephotourl, @doctor.profilephotourl
    assert_equal @doctorToUpdate.birthdate, @doctor.birthdate
    assert_equal @doctorToUpdate.biography, @doctor.biography
    assert_equal @doctorToUpdate.practicestartyear, @doctor.practicestartyear
  end
end
