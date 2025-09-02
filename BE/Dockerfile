# ----- Build stage -----
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy toàn bộ source
COPY . .

# Restore và publish đúng project Hinet.Api.csproj
RUN dotnet restore "Hinet.Api/Hinet.Api.csproj"
RUN dotnet publish "Hinet.Api/Hinet.Api.csproj" -c Release -o /app/publish

# ----- Runtime stage -----
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Tạo thư mục log (nếu bạn dùng Serilog)
RUN mkdir logs

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "Hinet.Api.dll"]
