require 'test_helper'

class AppointmentTest < ActiveSupport::TestCase  
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
  
  test "should not make appointments without appointment date" do
    appointment = Appointment.new
    assert_not appointment.save, "Created appointment without appointment date"
  end

  test "should schedule an appointment with valid parameters" do

    appointment = Appointment.new(@appointment.attributes.delete :id)
    assert appointment.save, "Can't save an appointment"
  end
end
