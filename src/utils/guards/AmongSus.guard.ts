import { CanActivate, ExecutionContext, Injectable, NotAcceptableException } from "@nestjs/common";
import { Request } from "express";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private prismaService: PrismaService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const api_key = this.extractApiKey(request);

    console.log("API Key:", api_key); // Log the API key for debugging

    if (!api_key) {
      throw new NotAcceptableException("API Key is missing");
    }

    // Check if the API key exists in the database
    const server = await this.prismaService.server.findFirst({
      where: { api_key },
    });

    if (!server) {
      throw new NotAcceptableException("Invalid API Key");
    }

    return true;
  }

  private extractApiKey(request: Request): string | undefined {
    const api_key = Array.isArray(request.headers['x-api-key'])
      ? request.headers['x-api-key'][0]  // If it's an array, get the first element
      : request.headers['x-api-key'];     // If it's a string, return it directly
    return api_key;
  }
}

