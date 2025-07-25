/**
 * This file was generated by kysely-codegen.
 * Please do not edit it manually.
 */

import type { ColumnType } from "kysely";

export type AuthRefreshTokenStatus = "compromise" | "logout" | "rotation";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface AccountsUsers {
  authUserId: string;
  createdAt: Generated<Timestamp>;
  email: string;
  id: Generated<string>;
  name: string;
  updatedAt: Generated<Timestamp>;
}

export interface AuthOauthRefreshTokens {
  authUserId: string;
  createdAt: Generated<Timestamp>;
  expiresAt: Generated<Timestamp>;
  id: Generated<string>;
  replacedByTokenId: string | null;
  revokedAt: Timestamp | null;
  revokedReason: AuthRefreshTokenStatus | null;
  shortId: string;
  updatedAt: Generated<Timestamp>;
}

export interface AuthUsers {
  createdAt: Generated<Timestamp>;
  email: string;
  id: Generated<string>;
  passwordHash: string;
  updatedAt: Generated<Timestamp>;
}

export interface TenantsOrganizationMemberships {
  createdAt: Generated<Timestamp>;
  id: Generated<string>;
  organizationId: string;
  updatedAt: Generated<Timestamp>;
  userId: string;
}

export interface TenantsOrganizations {
  createdAt: Generated<Timestamp>;
  createdById: string;
  id: Generated<string>;
  name: string;
  updatedAt: Generated<Timestamp>;
}

export interface TenantsPrograms {
  createdAt: Generated<Timestamp>;
  id: Generated<string>;
  name: string;
  organizationId: string;
  updatedAt: Generated<Timestamp>;
}

export interface DB {
  accountsUsers: AccountsUsers;
  authOauthRefreshTokens: AuthOauthRefreshTokens;
  authUsers: AuthUsers;
  tenantsOrganizationMemberships: TenantsOrganizationMemberships;
  tenantsOrganizations: TenantsOrganizations;
  tenantsPrograms: TenantsPrograms;
}
