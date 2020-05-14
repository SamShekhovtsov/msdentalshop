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
    assert_not appointment.valid?
    assert_equal 5, appointment.errors.size
    assert_not appointment.save, "Created appointment without appointment date"
  end

  test "should NOT save appointment with empty date" do
    appointmentValidAttributes = @appointment.attributes
    appointmentValidAttributes.delete("id")
    appointmentValidAttributes["date"] = nil
    appointment = Appointment.new(appointmentValidAttributes)
    assert_not appointment.valid?
    assert_equal 1, appointment.errors.size
    assert_not appointment.save, "Saved appointment with empty date"
  end

  test "should schedule an appointment with valid parameters" do

    appointmentValidAttributes = @appointment.attributes
    appointmentValidAttributes.delete("id")
    appointment = Appointment.new(appointmentValidAttributes)
    assert appointment.valid?
    assert_equal 0, appointment.errors.size
    assert appointment.save, "Can't schedule an appointment"
  end
end
