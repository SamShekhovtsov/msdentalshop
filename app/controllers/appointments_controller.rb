class AppointmentsController < ApplicationController
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
      @appointment = Appointment.new(appointment_params)
     
      if @appointment.save
        flash[:notice] = 'Appointment is scheduled successfully.'
        redirect_to @appointment
      else
        flash[:error] = 'Error while trying to schedule new appointment.'
        @doctors = Doctor.all
        @patients = Patient.all
        render "new"
      end
    end

    def edit
        @appointment = Appointment.find(params[:id])
        @doctors = Doctor.all
        @patients = Patient.all
    end

    def update
        @appointment = Appointment.find(params[:id])
       
        if @appointment.update(appointment_params)
          flash[:notice] = 'Appointment is changed successfully.'
          redirect_to @appointment
        else
          flash[:error] = 'Error while trying to update scheduled appointment.'
          @doctors = Doctor.all
          @patients = Patient.all
          render 'edit'
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
