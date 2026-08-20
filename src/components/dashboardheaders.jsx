// import { ModeToggle } from "@/components/mode-toggle";
import { Badge } from "./ui/badge";

const DashboardHeaders = ({ title, description }) => {
  return (
    <div>
      <div className=" flex mb-2">
        <div className="w-215">
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="text-xs">{description}</p>
        </div>
        <div className="flex gap-2 justify-between items-center">
          <span className="text-lg font-bold w-28">Hi Tobenna</span>
          <Badge className="bg-slate-100 text-slate-800 text-xs">Admin</Badge>

          {/* <ModeToggle /> */}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeaders;
