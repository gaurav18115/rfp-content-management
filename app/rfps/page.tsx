import { FileText } from "lucide-react";

export default function RfpsPage() {
    return (
        <div className="flex-1 w-full flex flex-col gap-8 max-w-7xl mx-auto p-6">
            <div className="w-full">
                <h1 className="text-3xl font-bold mb-2">Available RFPs</h1>
                <p className="text-muted-foreground">
                    Browse and respond to available Request for Proposals
                </p>
            </div>

            {/* RFP cards will be populated here when data is available */}
            <div className="text-center py-12">
                <FileText size="48" className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No RFPs Available</h3>
                <p className="text-muted-foreground">
                    There are currently no RFPs available. Check back later or contact us for more information.
                </p>
            </div>
        </div>
    );
} 