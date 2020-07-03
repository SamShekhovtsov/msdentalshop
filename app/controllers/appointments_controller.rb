class AppointmentsController < ApplicationController
    before_filter :authenticate_user!, except: [:index, :show]
    
    def index
        @appointments = Appointment.all
    end
    
    def show
      @appointment = Appointment.find(params[:id])
    end
  
    def new
        @appointment = Appointment.new
        @doctors = Doctor.all
        @patients = Patient.all
    end
  
    def create
        if !appointment_params[:date].nil? && appointment_params[:date] < DateTime.current
            flash[:error] = "Can't scheduled an appointment to a date in the past."
            @appointment = Appointment.new
            @doctors = Doctor.all
            @patients = Patient.all
            render "new"
        else

            @appointment = Appointment.new(appointment_params)
            
            if @appointment.save
                AppointmentReminderMailer.reminder_email(@appointment).deliver_now
                
                flash[:notice] = 'Appointment is scheduled successfully. Email reminder has been sent.'
                redirect_to @appointment
            else
                flash[:error] = 'Error while trying to schedule new appointment.'
                @appointment = Appointment.new
                @doctors = Doctor.all
                @patients = Patient.all
                render "new"
            end
        end
    end

    def edit
        @appointment = Appointment.find(params[:id])
        @doctors = Doctor.all
        @patients = Patient.all
    end

    def update
        if !appointment_params[:date].nil? && appointment_params[:date] < DateTime.current
            flash[:error] = "Can't re-scheduled the appointment to a date in the past."
            @appointment = Appointment.find(params[:id])
            @doctors = Doctor.all
            @patients = Patient.all
            render "edit"
        else

            @appointment = Appointment.find(params[:id])
        
            if @appointment.update(appointment_params)
                flash[:notice] = 'Appointment is changed successfully.'
                redirect_to @appointment
            else
                flash[:error] = 'Error while trying to update scheduled appointment.'
                @appointment = Appointment.find(params[:id])
                @doctors = Doctor.all
                @patients = Patient.all
                render 'edit'
            end
        end
    end


    def destroy
        @appointment = Appointment.find(params[:id])
        @appointment.destroy
   
        redirect_to appointments_path
    end
     
    private
      def appointment_params
        params.require(:appointment).permit(:date, :doctor_id, :patient_id)
      end
end
