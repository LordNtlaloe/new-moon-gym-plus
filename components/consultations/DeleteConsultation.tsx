"use client";

import { deleteConsultationBooking } from "@/app/_actions/consultation.actions";
import { useState } from "react";
import { showConfirmationMessage, showToastMessage } from "@/lib/general_functions";
import { BeatLoader } from "react-spinners";
import { useConsultationStore } from "@/lib/stores/consultationsStore";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const DeleteConsultationForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    showConsultationDeleteModal,
    setShowConsultationDeleteModal,
    consultationId,
    setConsultationID,
  } = useConsultationStore();
  const router = useRouter();

  const handleDelete = async () => {
    if (!consultationId) {
      showConfirmationMessage("error", "No consultation selected for deletion.");
      return;
    }

    setIsLoading(true);

    const deleted = await deleteConsultationBooking(consultationId);
    if (deleted) {
      showToastMessage("success", "Consultation successfully deleted.");
      setConsultationID("");
      setShowConsultationDeleteModal(false);
      router.push("/admin/consultations");
    } else {
      setIsLoading(false);
      showConfirmationMessage("error", "An error occurred while deleting the consultation.");
    }

    setIsLoading(false);
  };

  return (
    <AlertDialog open={showConsultationDeleteModal} onOpenChange={setShowConsultationDeleteModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
        </AlertDialogHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-4">
              <h1 className="font-bold">Deleting Consultation</h1>
              <BeatLoader color="#f50a0a" size={30} />
              <p className="font-semibold text-sm">Please wait...</p>
            </div>
          ) : (
            <p>Are you sure you want to delete this consultation? This action cannot be undone.</p>
          )}
        </CardContent>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setShowConsultationDeleteModal(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
            Confirm Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConsultationForm;
