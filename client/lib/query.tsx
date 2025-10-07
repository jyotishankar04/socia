import { useMutation, useQuery } from "@tanstack/react-query";
import { createConversation, getConversations, getConversesation, register, self, signin, verifyOtp } from "./api";

export const useSignUpMutation = () => useMutation({
    mutationFn: register,
    mutationKey: ["signup"]
});

export const useSignInMutation = () => useMutation({
    mutationFn: signin,
    mutationKey: ["signin"],
    onSuccess: (data) => {
        console.log(data);
    },
});

export const useSelfQuery = () => useQuery({
    queryKey: ["self"],
    queryFn: self,
    enabled: false
});


export const useOtpVerification = () => useMutation({
    mutationFn: verifyOtp,
    mutationKey: ["verify-otp"],
});

// Conversessions
export const useConversationsQuery = () => useQuery({
    queryKey: ["conversations"],
    queryFn: () => getConversations(),
});

export const useConversationCreateMutation = () => useMutation({
    mutationFn: createConversation,
    mutationKey: ["create-conversation"],
});

export const useGetConversation = (id: string) => useQuery({
    queryKey: ["conversation", id],
    queryFn: () => getConversesation(id),
    enabled: !!id
});