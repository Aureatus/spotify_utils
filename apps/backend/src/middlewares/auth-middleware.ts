import type { Session, User } from "better-auth/types";

import { getValidAccessToken } from "../lib/spotify";
import { auth } from "../utils/auth/auth";

export const userMiddleware = async (request: Request) => {
	const session = await auth.api.getSession({ headers: request.headers });

	if (!session) {
		return {
			user: null,
			session: null,
		};
	}

	const access_token = await getValidAccessToken(session.user.id);

	return {
		user: session.user,
		session: session.session,
		access_token,
	};
};

export const userInfo = (user: User | null, session: Session | null) => {
	return {
		user: user,
		session: session,
	};
};
