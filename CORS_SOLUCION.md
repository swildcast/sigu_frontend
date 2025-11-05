# 🔧 Solución Completa para Error de CORS

## 📋 Análisis del Problema

El error de CORS (Cross-Origin Resource Sharing) ocurre cuando:
- **Frontend Angular** corre en: `http://localhost:4200`
- **Backend .NET** corre en: `https://localhost:7084`
- El navegador bloquea las peticiones porque son orígenes diferentes (diferente puerto y protocolo)

## ✅ Solución 1: Configuración del Proxy de Angular (RECOMENDADA PARA DESARROLLO)

Esta solución evita el problema de CORS usando un proxy durante el desarrollo. Ya está configurada en el proyecto.

### Archivos Creados/Modificados:

1. **`proxy.conf.json`** - Configuración del proxy
2. **`angular.json`** - Configuración actualizada para usar el proxy
3. **`src/environments/environment.ts`** - URL actualizada para usar ruta relativa

### Pasos para usar:

1. **Actualizar environment.ts** para usar ruta relativa:
```typescript
export const environment = {
  production: false,
  apiUrl: '/api'  // Ruta relativa que será redirigida por el proxy
};
```

2. **Ejecutar el servidor de desarrollo:**
```bash
npm start
```

El proxy redirigirá automáticamente todas las peticiones de `/api/*` a `https://localhost:7084/api/*`

---

## ✅ Solución 2: Configuración de CORS en el Backend .NET

Si prefieres configurar CORS directamente en el backend (recomendado para producción), sigue estos pasos:

### Para .NET 6, 7, 8 (Program.cs):

```csharp
var builder = WebApplication.CreateBuilder(args);

// Agregar servicios
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ⭐ CONFIGURACIÓN DE CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200")  // Origen del frontend Angular
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// ⭐ HABILITAR CORS (debe ir ANTES de UseRouting)
app.UseCors("AllowAngularApp");

// Configuración del pipeline
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
```

### Para .NET 5 o anterior (Startup.cs):

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddControllers();
    
    // ⭐ CONFIGURACIÓN DE CORS
    services.AddCors(options =>
    {
        options.AddPolicy("AllowAngularApp", policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
    });
}

public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    // ⭐ HABILITAR CORS (debe ir ANTES de UseRouting)
    app.UseCors("AllowAngularApp");
    
    app.UseHttpsRedirection();
    app.UseRouting();
    app.UseAuthorization();
    app.UseEndpoints(endpoints =>
    {
        endpoints.MapControllers();
    });
}
```

### Configuración más flexible (múltiples orígenes):

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins(
                "http://localhost:4200",      // Desarrollo
                "http://localhost:4300",      // Desarrollo alternativo
                "https://tu-dominio.com"      // Producción
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
```

### Configuración para desarrollo (permitir todos los orígenes - NO RECOMENDADO PARA PRODUCCIÓN):

```csharp
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
```

---

## 🔍 Verificación

### 1. Verificar que el backend esté corriendo:
```bash
# El backend debe estar en https://localhost:7084
# Verifica en el navegador: https://localhost:7084/swagger (si tienes Swagger)
```

### 2. Verificar que el frontend esté corriendo:
```bash
npm start
# Debe estar en http://localhost:4200
```

### 3. Verificar en la consola del navegador:
- Abre DevTools (F12)
- Ve a la pestaña "Network"
- Intenta hacer una petición
- Verifica que no aparezca el error de CORS

---

## 🚨 Problemas Comunes y Soluciones

### Error: "Access to XMLHttpRequest blocked by CORS policy"
**Causa:** El backend no está configurado para permitir el origen del frontend.

**Solución:**
- Usa la Solución 1 (proxy) para desarrollo
- O configura CORS en el backend (Solución 2)

### Error: "SSL Certificate" o "NET::ERR_CERT_AUTHORITY_INVALID"
**Causa:** El certificado HTTPS del backend no es válido.

**Solución:**
- En `proxy.conf.json` ya está configurado `"secure": false`
- O en el navegador, acepta la excepción del certificado

### Las peticiones no llegan al backend
**Causa:** El proxy no está funcionando correctamente.

**Solución:**
1. Verifica que `proxy.conf.json` esté en la raíz del proyecto
2. Verifica que `angular.json` tenga la configuración del proxy
3. Reinicia el servidor de desarrollo: `npm start`

---

## 📝 Notas Importantes

1. **Proxy solo funciona en desarrollo**: El proxy de Angular solo funciona con `ng serve`. Para producción, debes configurar CORS en el backend.

2. **Orden de middleware**: En .NET, `UseCors()` debe ir ANTES de `UseRouting()` y `UseAuthorization()`.

3. **HTTPS en desarrollo**: Si usas HTTPS en el backend, asegúrate de que `proxy.conf.json` tenga `"secure": false` para desarrollo.

4. **Producción**: Para producción, configura CORS en el backend con los orígenes específicos de tu aplicación desplegada.

---

## 🎯 Resumen de Cambios Aplicados

✅ **Archivo creado:** `proxy.conf.json` - Configuración del proxy
✅ **Archivo actualizado:** `angular.json` - Configuración del proxy agregada
📝 **Pendiente:** Actualizar `environment.ts` para usar ruta relativa `/api`

---

## 📚 Referencias

- [Angular Proxy Configuration](https://angular.io/guide/build#proxying-to-a-backend-server)
- [.NET CORS Documentation](https://learn.microsoft.com/en-us/aspnet/core/security/cors)
- [MDN CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)


