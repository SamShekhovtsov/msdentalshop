class AppointmentsController < ApplicationController
    def index
        @appointments = Appointment.all
    end
    
    def show
      @appointment = Appointment.find(params[:id])
    end
  
    def new
  
    end
  
    def create
      @appointment = Appointment.new(appointment_params)
     
      @appointment.save
      redirect_to @appointment
    end
     
    private
      def appointment_params
        params.require(:appointment).permit(:date, :text)
      end
end
