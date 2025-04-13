"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import React from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";


type PageItem = {
  title: string;
  date: string;
};

type RoutineItem = { time: string; activity: string };
type Routine = Record<string, RoutineItem[]>;

export default function ResultPage() {
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const [routine, setRoutine] = useState<Routine>({});
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const rawData = searchParams.get("data");
    if (!rawData) return;

    try {
      const decoded = decodeURIComponent(rawData);
      const parsed = JSON.parse(decoded);
      if (typeof parsed === "object") {
        setRoutine(parsed);
      }
    } catch (err) {
      console.error("Failed to parse routine:", err);
    }
  }, [searchParams]);

  const handleReset = () => {
    const confirmed = confirm("Are you sure you want to reset your routine?");
    if (confirmed) {
      setRoutine({});
      router.push("/AI/Routine/routine");
    }
  };

  const toggleCheck = (key: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Fill background with black
    doc.setFillColor(0, 0, 0);
    doc.rect(
      0,
      0,
      doc.internal.pageSize.getWidth(),
      doc.internal.pageSize.getHeight(),
      "F"
    );

    // Title styling
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Your Daily Routine", 14, 15);

    const header = ["Time", "Activity", "Completed"];
    let yOffset = 25;

    Object.entries(routine).forEach(([partOfDay, tasks]) => {
      // Section Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(200, 200, 200);
      doc.text(partOfDay.toUpperCase(), 14, yOffset);
      yOffset += 2;

      const tableData = tasks.map((task, i) => {
        const taskStatus = checkedItems[`${partOfDay}-${i}`] ? "done" : "left";
        return [task.time, task.activity, taskStatus];
      });

      autoTable(doc, {
        startY: yOffset,
        head: [header],
        body: tableData,
        theme: "grid",
        styles: {
          font: "courier", // mono font for body
          fontSize: 11,
          fillColor: [30, 30, 30],
          textColor: 255,
          lineColor: [100, 100, 100],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [60, 60, 60],
          textColor: 255,
          fontStyle: "bold",
          font: "helvetica",
          fontSize: 12,
        },
        bodyStyles: {
          fillColor: [25, 25, 25],
          textColor: 230,
        },
        didDrawCell: (data) => {
          if (data.cursor) {
            yOffset = data.cursor.y;
          }
        },
      });

      yOffset += 20;
    });
    doc.setTextColor(150, 150, 150);
    doc.setFont("courier", "bold");
    doc.setFontSize(15);
    doc.text("Generated By Aurio", 150, 295);
    doc.save("daily_routine.pdf");
  };

  return (
    <main className="flex flex-col ml-[20%] h-screen bg-[#202020] text-white">
      {/* Header */}
      <header className="px-6 py-4 bg-[#101010] border-b border-[#303030]">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-white">
            Your Daily Routine
          </h1>
          <button
            onClick={handleReset}
            className="bg-black hover:bg-white/50 cursor-pointer text-white hover:text-black border border-dashed border-white/20 px-4 py-2 rounded-xl transition-all drop-shadow-[0_0_6px_rgba(255,0,0,0.3)]"
          >
            Go Back
          </button>
        </div>
      </header>

      {/* Routine Checklist */}
      <section className="flex-1 overflow-y-auto px-6 py-8">
        {Object.keys(routine).length === 0 ? (
  <p className="text-gray-300 text-center text-lg mt-10">
    No routine data available.
  </p>
) : (
  <div className="w-full overflow-x-auto">
    <table className="w-full border-collapse shadow-md text-sm">
      <thead>
        <tr className="bg-[#101010] text-white border-b border-white/10">
          <th className="px-6 py-3 text-left font-semibold border-b border-white/10">
            Time
          </th>
          <th className="px-6 py-3 text-left font-semibold border-b border-white/10">
            Activity
          </th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(routine).map(([partOfDay, tasks]) => (
          <React.Fragment key={partOfDay}>
            <tr className="bg-[#2a2a2a] border-t border-white/10">
              <td
                colSpan={2}
                className="px-6 py-3 font-bold uppercase text-cyan-400 tracking-wide border-b border-white/10"
              >
                {partOfDay}
              </td>
            </tr>

            {Array.isArray(tasks) ? (
              tasks.map((task, i) => {
                const taskKey = `${partOfDay}-${i}`;
                const isChecked = checkedItems[taskKey];

                return (
                  <tr
                    key={taskKey}
                    onClick={() => toggleCheck(taskKey)}
                    className={`cursor-pointer transition-all duration-200 ${
                      isChecked ? "bg-[#1e1e1e]" : "hover:bg-[#2e2e2e]"
                    }`}
                  >
                    <td className="px-6 py-2 border-b border-white/10">
                      <label className="flex items-center space-x-2 w-full">
                        <input
                          type="checkbox"
                          checked={!!isChecked}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => toggleCheck(taskKey)}
                          className="form-checkbox h-4 w-4 text-cyan-400 border-gray-500 rounded focus:ring-0"
                        />
                        <span
                          className={`transition-all ${
                            isChecked ? "line-through text-gray-400" : ""
                          }`}
                        >
                          🕒 {task.time}
                        </span>
                      </label>
                    </td>
                    <td className="px-6 py-2 border-b border-white/10">
                      <span
                        className={`transition-all ${
                          isChecked ? "line-through text-gray-400" : ""
                        }`}
                      >
                        📌 {task.activity}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={2} className="px-6 py-2 italic text-gray-400">
                  No tasks for this time period.
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  </div>
)}

      </section>

      {/* Download Button */}
      <div className="px-6 py-4 bg-[#101010] border-t border-[#303030] flex justify-end">
        {/* <button
          onClick={handleSavePage}
          className="flex items-center gap-2 bg-black text-white border border-dashed border-white/30 px-4 py-2 rounded-xl transition-all hover:bg-white/90 hover:text-black hover:border-white/50 shadow-md transform cursor-pointer"
          title="Save To Pages"
        >
          Save To Pages
        </button> */}
        <button
          onClick={generatePDF}
          className="flex ml-5 items-center gap-2 bg-black text-white border border-dashed border-white/30 px-4 py-2 rounded-xl transition-all hover:bg-white/90 hover:text-black hover:border-white/50 shadow-md transform cursor-pointer"
          title="Download your routine"
        >
          Download
        </button>
      </div>
    </main>
  );
}
