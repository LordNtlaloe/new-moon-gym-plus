import { getAllConsultationBookings } from "@/app/_actions/consultation.actions";
import { ConsultationsTable } from "@/components/consultations/consultationsTable/consultationsTable";
import { columns } from "@/components/consultations/consultationsTable/columns";

const getConsultations = async () => {
  const data = await getAllConsultationBookings();
  return data;
};

const ConsultationsPage = async () => {
  const consultations = await getConsultations();
  return (
    <section className="mx-1">
      <div className="">
        <div className="flex item-center justify-between mb-2">
          <h1 className="mb-3 md:text-3xl font-bold">Consultations</h1>
        </div>
        <div>
          <ConsultationsTable columns={columns} data={consultations} />
        </div>
      </div>
    </section>
  );
};

export default ConsultationsPage;