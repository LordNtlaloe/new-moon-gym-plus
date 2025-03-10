import { getWaitingList } from "@/app/_actions/waitinglist.actions";
import { WaitingListTable } from "@/components/waiting-list/WaitingListTable/WaitingListTable";
import { columns } from "@/components/waiting-list/WaitingListTable/colums";


const getList = async () => {
  const data = await getWaitingList();
  return data;
};

const WaitingListPage = async () => {
  const waitingList = await getList();
  return (
    <section className="mx-1">
      <div className="">
        <div className="flex item-center justify-between mb-2">
          <h1 className="mb-3 md:text-3xl font-bold">Waiting List</h1>
        </div>
        <div>
          <WaitingListTable columns={columns} data={waitingList} />
        </div>

      </div>

    </section>
  );
};

export default WaitingListPage;
