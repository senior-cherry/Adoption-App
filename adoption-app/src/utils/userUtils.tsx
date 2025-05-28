const checkUserRole = (session: any) => {
    if (!session || !session.user) {
        return "guest";
    }

    if (
        (session &&
        session.user) &&
        (!session.user.organizationMemberships ||
        session.user.organizationMemberships.length === 0)
    ) {
        return "user";
    }

    const organizationMemberships = session.user.organizationMemberships;

    for (const membership of organizationMemberships) {
        if (membership.role) {
            return membership.role.toLowerCase();
        }
    }

    return null;
}

export { checkUserRole };




