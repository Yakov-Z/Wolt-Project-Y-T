#pragma once
#include <string>
#include <fstream>
#include "IPersistanceData.h"

class FileRepository : public IPersistanceData {
private:
    std::string filePath;

public:
    explicit FileRepository(const std::string& path);

    void saveData(const StorageDataList& allData);

    StorageDataList loadAllData();
};