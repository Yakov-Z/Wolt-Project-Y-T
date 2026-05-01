# Define Cmake version
cmake_minimum_required(VERSION 3.14)
# Define project name
project(RecommendationSystem)
# Define the min version of CPP required for the compiling
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# src is the headers directory
include_directories(src)

# Download the Gtest Engine source code and prepare it 
include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/03597a01ee50ed33e9dfd640b249b4be3799d395.zip
)
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

# Define all the logic files as CORE_SOURCE
set(CORE_SOURCES
    src/ConsoleInputReader.cpp
     src/ConsoleOutputWriter.cpp
    src/MemoryDataRepository.cpp
    src/HelpCommand.cpp
    src/FileRepository.cpp
    # src/FilePersistence.cpp
    # src/CommonUsersStrategy.cpp
    # src/CLIParser.cpp
    # src/AddCommand.cpp
    # src/RecommendCommand.cpp
    # src/HelpCommand.cpp
)

# Create the project main exe with all logic files
# add_executable(RecommenderApp 
#     src/main.cpp 
#     ${CORE_SOURCES}
    
# )

# Define all the test files as TEST_SOURCES
set(TEST_SOURCES
    tests/ConsoleInputReaderTest.cpp
    tests/ConsoleOutputWriterTest.cpp
     tests/MemoryDataRepositoryTest.cpp
    tests/HelpCommandTest.cpp
    tests/FileRepositoryTest.cpp
    
)

# Create the test exe with all test files
add_executable(runTests 
    ${TEST_SOURCES} 
    ${CORE_SOURCES}
)

# Connect test file to Gtest Engine
target_link_libraries(runTests PRIVATE gtest_main)