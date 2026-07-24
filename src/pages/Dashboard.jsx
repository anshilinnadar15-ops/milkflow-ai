import {
  Factory,
  Gauge,
  Cpu,
  Award,
  AlertTriangle,
  Droplets,
  Clock,
  Bot
} from "lucide-react";

import { useState } from "react";
import Papa from "papaparse";
import KpiCard from "../components/KpiCard";
import { formatNumber } from "../utils/formatters";


export default function Dashboard() {


const [dashboard,setDashboard] = useState(null);



const icons={

batchesToday:Factory,
efficiency:Gauge,
plantHealth:Cpu,
qualityScore:Award,
aiRisk:AlertTriangle,
productionOutput:Droplets,
waste:AlertTriangle,
downtime:Clock

};




// CSV UPLOAD FUNCTION

const handleCSV=(e)=>{


const file=e.target.files[0];


Papa.parse(file,{

header:true,

skipEmptyLines:true,


complete:(result)=>{


const rows=result.data;


// Example aggregation

const output={


batchesToday:rows.length,


efficiency:
average(rows,"Efficiency"),


plantHealth:
average(rows,"PlantHealth"),


qualityScore:
average(rows,"QualityScore"),


aiRisk:
average(rows,"Risk"),


productionOutput:
sum(rows,"MilkProduced"),


waste:
sum(rows,"Waste"),


downtime:
sum(rows,"Downtime"),


costImpact:
sum(rows,"Cost"),


aiSavings:
350000


};


setDashboard(output);


}


});


};





function average(data,key){

let values=data.map(x=>Number(x[key])||0);

return Math.round(
values.reduce((a,b)=>a+b,0)/values.length
);

}



function sum(data,key){

return data.reduce(
(total,row)=>
total+(Number(row[key])||0),
0
);

}




const kpis = dashboard && {


batchesToday:{
value:dashboard.batchesToday,
unit:""
},


efficiency:{
value:dashboard.efficiency,
unit:"%"
},


plantHealth:{
value:dashboard.plantHealth,
unit:"%"
},


qualityScore:{
value:dashboard.qualityScore,
unit:"%"
},


aiRisk:{
value:dashboard.aiRisk,
unit:"%"
},


productionOutput:{
value:dashboard.productionOutput,
unit:"L"
},


waste:{
value:dashboard.waste,
unit:"L"
},


downtime:{
value:dashboard.downtime,
unit:"min"
}


};





return (

<div className="p-6 bg-gray-100 min-h-screen space-y-6">


{/* CSV UPLOAD */}

<div className="bg-white p-5 rounded-xl shadow">


<h2 className="text-xl font-bold">

📂 Upload Dairy Production CSV

</h2>


<input

type="file"

accept=".csv"

onChange={handleCSV}

className="mt-3 border p-2"

/>


</div>






{
dashboard &&

<>


{/* HEADER */}

<div className="bg-white p-5 rounded-xl shadow">


<h1 className="text-2xl font-bold">

🥛 Smart Dairy AI Manufacturing Control Center

</h1>


<p>
Plant: Mumbai Dairy Unit |
AI Status 🟢 Active
</p>


</div>






{/* KPI CARDS */}


<div className="grid md:grid-cols-4 grid-cols-2 gap-4">


{

Object.entries(kpis).map(([key,value],index)=>(


<KpiCard

key={key}

index={index}

icon={icons[key]}

label={
key.replace(/([A-Z])/g," $1")
}

value={
formatNumber(value.value)
}

unit={value.unit}

/>


))


}


</div>







{/* EXECUTIVE DASHBOARD */}


<div className="bg-white p-5 rounded-xl shadow">


<h2 className="text-xl font-bold">

📊 Executive Dashboard

</h2>


<div className="grid md:grid-cols-5 gap-5 mt-4">


<div>
Production
<h3>
{dashboard.productionOutput} L
</h3>
</div>


<div>
Waste
<h3>
{dashboard.waste} L
</h3>
</div>


<div>
Downtime
<h3>
{dashboard.downtime} min
</h3>
</div>


<div>
Cost
<h3>
₹{dashboard.costImpact}
</h3>
</div>


<div>
AI Savings
<h3>
₹{dashboard.aiSavings}
</h3>
</div>


</div>


</div>






{/* AI BOT */}


<div className="fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full">

<Bot/>

</div>


</>


}


</div>


)

}
