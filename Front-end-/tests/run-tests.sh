#!/bin/bash

# Script para ejecutar pruebas de Selenium
# Asegúrate de que el servidor de desarrollo esté corriendo en http://localhost:3000

echo "🚀 Ejecutando pruebas de Selenium para ResetMental"
echo ""

# Verificar que el servidor esté corriendo
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "❌ Error: El servidor de desarrollo no está corriendo en http://localhost:3000"
    echo "   Por favor, ejecuta: npm run dev"
    exit 1
fi

echo "✓ Servidor de desarrollo detectado"
echo ""

# Función para ejecutar pruebas
run_test() {
    local test_file=$1
    local test_name=$2
    
    echo "📋 Ejecutando: $test_name"
    echo "----------------------------------------"
    
    if [ -f "$test_file" ]; then
        npx mocha "$test_file" --timeout 30000
        local exit_code=$?
        
        if [ $exit_code -eq 0 ]; then
            echo "✅ $test_name: PASÓ"
        else
            echo "❌ $test_name: FALLÓ"
        fi
        echo ""
        return $exit_code
    else
        echo "⚠️  Archivo no encontrado: $test_file"
        echo ""
        return 1
    fi
}

# Ejecutar pruebas individuales
if [ "$1" != "" ]; then
    case $1 in
        navigation)
            run_test "tests/selenium/navigation.test.js" "Pruebas de Navegación"
            ;;
        forms)
            run_test "tests/selenium/forms.test.js" "Pruebas de Formularios"
            ;;
        functionality)
            run_test "tests/selenium/functionality.test.js" "Pruebas de Funcionalidades"
            ;;
        accessibility)
            run_test "tests/selenium/accessibility.test.js" "Pruebas de Accesibilidad"
            ;;
        homepage)
            run_test "tests/selenium/homepage.test.js" "Pruebas de Página Principal"
            ;;
        quick)
            run_test "tests/selenium/quick-test.js" "Prueba Rápida"
            ;;
        all)
            echo "Ejecutando todas las pruebas..."
            echo ""
            run_test "tests/selenium/navigation.test.js" "Pruebas de Navegación"
            run_test "tests/selenium/forms.test.js" "Pruebas de Formularios"
            run_test "tests/selenium/functionality.test.js" "Pruebas de Funcionalidades"
            run_test "tests/selenium/accessibility.test.js" "Pruebas de Accesibilidad"
            run_test "tests/selenium/homepage.test.js" "Pruebas de Página Principal"
            ;;
        *)
            echo "Uso: $0 [navigation|forms|functionality|accessibility|homepage|quick|all]"
            exit 1
            ;;
    esac
else
    echo "Uso: $0 [navigation|forms|functionality|accessibility|homepage|quick|all]"
    echo ""
    echo "Ejemplos:"
    echo "  $0 all              # Ejecutar todas las pruebas"
    echo "  $0 navigation       # Solo pruebas de navegación"
    echo "  $0 forms            # Solo pruebas de formularios"
    exit 1
fi

echo "✨ Pruebas completadas"

