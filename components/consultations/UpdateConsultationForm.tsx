"use client";

import { updateConsultationBookingStatus } from "@/app/_actions/consultation.actions";
import { useState } from "react";
import { showConfirmationMessage, showToastMessage } from "@/lib/general_functions";
import { BeatLoader } from "react-spinners";
import { useConsultationStore } from "@/lib/stores/consultationsStore";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const UpdateConsultationForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    showUpdateConsultationModal,
    setShowUpdateConsultationModal,
    consultationId,
    consultationStatus,
    setConsultationID,
    setConsultationStatus,
  } = useConsultationStore();
  const router = useRouter();

  const saveConsultationUpdate = async (formData: FormData) => {
    const newStatus = formData.get("consultationStatus") as string;

    if (!newStatus) {
      showConfirmationMessage("error", "Please select a consultation status.");
      return;
    }
    if (newStatus === consultationStatus) {
      showConfirmationMessage("warning", "Consultation status has not changed!");
      return;
    }

    setIsLoading(true);

    const updatedConsultation = await updateConsultationBookingStatus(consultationId, newStatus);
    if (updatedConsultation) {
      showToastMessage("success", "Consultation status successfully updated.");
      setConsultationID("");
      setConsultationStatus("");
      setShowUpdateConsultationModal(false);
      router.push("/admin/consultations");
    } else {
      setIsLoading(false);
      showConfirmationMessage("error", `An error occurred updating consultation! ${updatedConsultation}`);
    }

    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Update Consultation Status</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="font-bold">Saving Consultation</h1>
            <BeatLoader color="#0a09f5" size={30} />
            <p className="font-semibold text-sm">Please wait...</p>
          </div>
        ) : (
          <form
            action={(formData: FormData) => {
              setIsLoading(true);
              saveConsultationUpdate(formData);
              setIsLoading(false);
            }}
          >
            <div className="flex flex-col gap-4">
              <Label htmlFor="consultationStatus">Consultation Status</Label>
              <Select
                defaultValue={consultationStatus}
                name="consultationStatus"
                onValueChange={(value) => setConsultationStatus(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Declined">Declined</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Update
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  setShowUpdateConsultationModal(false);
                  setConsultationID("");
                  setConsultationStatus("");
                  router.push("/admin/consultations");
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default UpdateConsultationForm;
