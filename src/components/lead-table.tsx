import Link from 'next/link';

interface Lead {
  id: string;
  name: string;
  score: number;
  stage: string;
  summary: string;
}

interface LeadTableProps {
  leads: Lead[];
}

export default function LeadTable({ leads }: LeadTableProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border">
            <th className="pb-2">Lead Name</th>
            <th className="pb-2">Score</th>
            <th className="pb-2">Stage</th>
            <th className="pb-2">Summary</th>
            <th className="pb-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b border-border">
              <td className="py-4">{lead.name}</td>
              <td className="py-4">
                <span className={`px-2 py-1 rounded text-white text-sm ${getScoreColor(lead.score)}`}>
                  {lead.score}
                </span>
              </td>
              <td className="py-4">{lead.stage}</td>
              <td className="py-4">{lead.summary}</td>
              <td className="py-4">
                <Link href={`/conversation/${lead.id}`} className="text-primary hover:underline">
                  Open Conversation
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}