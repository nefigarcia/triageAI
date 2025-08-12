"use client"

import { useState } from "react"
import { Loader2, Wand2 } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { suggestReplyAction } from "@/lib/actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface SuggestReplyProps {
    ticketContent: string;
}

export function SuggestReply({ ticketContent }: SuggestReplyProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [suggestedReply, setSuggestedReply] = useState("");
    const [replyText, setReplyText] = useState("");
    const { toast } = useToast();

    const handleSuggestReply = async () => {
        setIsLoading(true);
        setSuggestedReply("");
        const result = await suggestReplyAction(ticketContent);
        if (result.error) {
            toast({
                variant: "destructive",
                title: "Suggestion Failed",
                description: result.error,
            });
        } else if (result.suggestedResponse) {
            setSuggestedReply(result.suggestedResponse);
        }
        setIsLoading(false);
    };

    const useSuggestion = () => {
        setReplyText(suggestedReply);
        setSuggestedReply("");
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Respond to Customer</CardTitle>
                <CardDescription>Craft a reply or let AI suggest one for you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 {suggestedReply && (
                    <Alert>
                        <Wand2 className="h-4 w-4" />
                        <AlertTitle>AI Suggestion</AlertTitle>
                        <AlertDescription className="space-y-4">
                            <p className="text-sm">{suggestedReply}</p>
                            <div className="flex gap-2">
                                <Button size="sm" onClick={useSuggestion}>Use this suggestion</Button>
                                <Button size="sm" variant="ghost" onClick={() => setSuggestedReply("")}>Discard</Button>
                            </div>
                        </AlertDescription>
                    </Alert>
                )}

                <Textarea 
                    placeholder="Type your reply here..." 
                    className="min-h-[150px]"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                />

                <div className="flex justify-between">
                    <Button onClick={handleSuggestReply} disabled={isLoading} variant="outline">
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Wand2 className="mr-2 h-4 w-4" />
                        )}
                        Suggest Reply
                    </Button>
                    <Button disabled={!replyText.trim()}>Send Reply</Button>
                </div>
            </CardContent>
        </Card>
    )
}
