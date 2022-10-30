import { getUserCommunities } from "./../repositories/communityRepository.js"

export const checkCommunityRequest = (payload) => {
    return payload.name && payload.description
}

export const userCommunities = async (userId, communityId) => {

    let communities = await getUserCommunities(userId);
    communities = communities.map(el => el.communityId);

    return communities.includes(communityId)
}