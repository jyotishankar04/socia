import { useMutation, useQuery } from "@tanstack/react-query";
import { acceptDraft, createConversation, deleteConversation, getConversations, getConversesation, logout, register, renameConversation, self, sendMessage, signin, updatePost, verifyOtp, getMediaAuth, getMediaLibrary, generateImage, editImage, generateBanner, generateCarousel, generateThumbnail, saveMediaAsset, deleteMediaAsset, toggleAssetFavorite, getS3PresignedUrl } from "./api";

export const useSignUpMutation = () => useMutation({
    mutationFn: register,
    mutationKey: ["signup"]
});

export const useSignInMutation = () => useMutation({
    mutationFn: signin,
    mutationKey: ["signin"],
});

export const useSelfQuery = () => useQuery({
    queryKey: ["self"],
    queryFn: self,
    enabled: false,
    refetchOnWindowFocus: false
});

export const useOtpVerification = () => useMutation({
    mutationFn: verifyOtp,
    mutationKey: ["verify-otp"],
});

export const useLogoutMutation = () => useMutation({
    mutationFn: logout,
    mutationKey: ["logout"],
});

// Conversations
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

export const useSendMessageMutation = (conversationId: string) => useMutation({
    mutationFn: (content: string) => sendMessage({ content, conversationId }),
    mutationKey: ["send-message", conversationId],
});

export const useAcceptDraft = () => useMutation({
    mutationFn: acceptDraft,
    mutationKey: ["accept-draft"],
});

export const useRenameConversation = () => useMutation({
    mutationFn: renameConversation,
    mutationKey: ["rename-conversation"],
});

export const useDeleteConversation = () => useMutation({
    mutationFn: deleteConversation,
    mutationKey: ["delete-conversation"],
});

export const useUpdatePost = () => useMutation({
    mutationFn: updatePost,
    mutationKey: ["update-post"],
});

export const useMediaAuth = () => useQuery({
    queryKey: ["media-auth"],
    queryFn: getMediaAuth,
    staleTime: 1000 * 60 * 25,
    enabled: true,
});

// Media Library
export const useMediaLibraryQuery = (params?: {
    page?: number; limit?: number; type?: string; source?: string; favorite?: boolean; q?: string;
}) => useQuery({
    queryKey: ["media-library", params],
    queryFn: () => getMediaLibrary(params),
});

export const useGenerateImageMutation = () => useMutation({
    mutationFn: generateImage,
    mutationKey: ["generate-image"],
});

export const useEditImageMutation = () => useMutation({
    mutationFn: editImage,
    mutationKey: ["edit-image"],
});

export const useGenerateBannerMutation = () => useMutation({
    mutationFn: generateBanner,
    mutationKey: ["generate-banner"],
});

export const useGenerateCarouselMutation = () => useMutation({
    mutationFn: generateCarousel,
    mutationKey: ["generate-carousel"],
});

export const useGenerateThumbnailMutation = () => useMutation({
    mutationFn: generateThumbnail,
    mutationKey: ["generate-thumbnail"],
});

export const useSaveAssetMutation = () => useMutation({
    mutationFn: saveMediaAsset,
    mutationKey: ["save-asset"],
});

export const useDeleteAssetMutation = () => useMutation({
    mutationFn: deleteMediaAsset,
    mutationKey: ["delete-asset"],
});

export const useToggleFavoriteMutation = () => useMutation({
    mutationFn: toggleAssetFavorite,
    mutationKey: ["toggle-favorite"],
});

export const useS3PresignedUrl = (fileName: string, contentType: string) => useQuery({
    queryKey: ["s3-presign", fileName, contentType],
    queryFn: () => getS3PresignedUrl(fileName, contentType),
    enabled: false,
});
